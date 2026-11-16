/**
 * @file apps/web/src/services/api.ts
 * Type-safe API Client for SvasthNexis Backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  [key: string]: any;
}

export class ApiClient {
  private baseUrl: string;
  private currentRole: string = 'PATIENT';
  private currentUserId: string = 'usr-pat-001';

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  public setAuth(role: string, userId: string) {
    this.currentRole = role;
    this.currentUserId = userId;
  }

  public getAuth() {
    return { role: this.currentRole, userId: this.currentUserId };
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-user-role': this.currentRole,
      'x-user-id': this.currentUserId,
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {
        // Fallback to text or status text
      }
      const error: any = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  // Health
  public getReadiness() {
    return this.request<{ status: string; environment: string; persistence: string }>('/health/readiness');
  }

  // State
  public getState() {
    return this.request<any>('/api/v1/state');
  }

  // Scheduling & Slots
  public holdSlot(slotId: string, patientId: string, durationMinutes = 10) {
    return this.request('/api/v1/slots/hold', {
      method: 'POST',
      body: JSON.stringify({ slotId, patientId, durationMinutes }),
    });
  }

  public createAppointment(payload: any) {
    return this.request('/api/v1/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public transitionAppointment(appointmentId: string, newState: string, reason?: string) {
    return this.request(`/api/v1/appointments/${appointmentId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ newState, role: this.currentRole, userId: this.currentUserId, reason }),
    });
  }

  // Payment Webhook
  public triggerPaymentWebhook(payload: {
    eventId: string;
    appointmentId: string;
    amountMinorUnits: number;
    paymentMode?: string;
    gatewayProvider?: string;
    status?: string;
  }) {
    return this.request('/api/v1/webhooks/payment', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Consents
  public createConsent(payload: {
    patientId: string;
    recipientId: string;
    purpose: string;
    scopeCategories: string[];
    validHours?: number;
  }) {
    return this.request('/api/v1/consents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public revokeConsent(consentId: string, reason?: string) {
    return this.request(`/api/v1/consents/${consentId}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Clinical Encounter
  public signEncounter(payload: {
    encounterId: string;
    doctorRmpId: string;
    rmpLicenseNumber: string;
    notes: string;
    vitals: any;
    diagnosis?: string;
    prescription?: any;
  }) {
    return this.request('/api/v1/encounters/sign', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public amendEncounter(encounterId: string, reason: string, addendumText: string) {
    return this.request('/api/v1/encounters/amend', {
      method: 'POST',
      body: JSON.stringify({ encounterId, doctorRmpId: this.currentUserId, reason, addendumText }),
    });
  }

  // Clinical Chart (RBAC check)
  public getClinicalChart(patientId: string) {
    return this.request(`/api/v1/clinical/chart?patientId=${patientId}`);
  }

  // OPD Queue
  public async getOpdQueue() {
    const res = await this.request<any>('/api/v1/opd/queue');
    return Array.isArray(res) ? res : res.tokens || [];
  }

  public createQueueToken(payload: { patientId: string; doctorId: string; facilityId: string; priority?: string }) {
    return this.request('/api/v1/opd/queue/tokens', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public transitionQueueToken(tokenId: string, newState: string) {
    return this.request(`/api/v1/opd/queue/${tokenId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ newState }),
    });
  }

  // Beds & Inpatient
  public async getBeds() {
    const res = await this.request<any>('/api/v1/inpatient/beds');
    return Array.isArray(res) ? res : res.beds || [];
  }

  public admitPatient(payload: { patientId: string; bedId: string; admittingDoctorId: string; primaryDiagnosis: string }) {
    return this.request('/api/v1/inpatient/admissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public transferBed(admissionId: string, targetBedId: string, reason: string) {
    return this.request('/api/v1/inpatient/beds/transfer', {
      method: 'POST',
      body: JSON.stringify({ admissionId, targetBedId, reason }),
    });
  }

  public dischargePatient(admissionId: string, checklist: { doctorClearance: boolean; pharmacyClearance: boolean; billingClearance: boolean }) {
    return this.request('/api/v1/inpatient/discharge', {
      method: 'POST',
      body: JSON.stringify({ admissionId, ...checklist }),
    });
  }

  // Nursing
  public recordObservation(admissionId: string, data: any) {
    return this.request('/api/v1/nursing/observations', {
      method: 'POST',
      body: JSON.stringify({ admissionId, ...data }),
    });
  }

  public recordMarAdmin(admissionId: string, medicationName: string, dose: string, route: string) {
    return this.request('/api/v1/nursing/mar/administer', {
      method: 'POST',
      body: JSON.stringify({ admissionId, medicationName, dose, route, administeredBy: this.currentUserId }),
    });
  }

  // Diagnostics & LIS
  public createLabOrder(payload: { patientId: string; doctorId: string; tests: string[]; urgency?: string }) {
    return this.request('/api/v1/lis/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public accessionSpecimen(orderId: string, specimenType: string, barcode: string) {
    return this.request('/api/v1/lis/specimens', {
      method: 'POST',
      body: JSON.stringify({ orderId, specimenType, barcode }),
    });
  }

  public enterLabResult(payload: { orderId: string; testName: string; value: string; unit: string; referenceRange: string; isCritical?: boolean }) {
    return this.request('/api/v1/lis/results', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public validateLabResult(resultId: string, comments?: string) {
    return this.request(`/api/v1/lis/results/${resultId}/validate`, {
      method: 'POST',
      body: JSON.stringify({ pathologistRmpId: this.currentUserId, pathologistLicense: 'KMC-RMP-88319', comments }),
    });
  }

  // Pharmacy
  public async getFormulary() {
    const res = await this.request<any>('/api/v1/pharmacy/formulary');
    return Array.isArray(res) ? res : res.formulary || [];
  }

  public dispenseMedication(payload: { prescriptionId: string; medicationName: string; quantity: number; batchNumber: string }) {
    return this.request('/api/v1/pharmacy/dispense', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Emergency
  public triageEmergency(payload: { patientName: string; chiefComplaint: string; esiLevel: number; assignedBay: string }) {
    return this.request('/api/v1/emergency/triage', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getEmergencyCases() {
    const res = await this.request<any>('/api/v1/emergency/cases');
    return Array.isArray(res) ? res : res.cases || [];
  }

  // OT Bookings & Checklist
  public async getOtBookings() {
    const res = await this.request<any>('/api/v1/ot/bookings');
    return Array.isArray(res) ? res : res.otBookings || [];
  }

  public createOtBooking(payload: any) {
    return this.request('/api/v1/ot/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public updateOtChecklist(bookingId: string, phase: 'SIGN_IN' | 'TIME_OUT' | 'SIGN_OUT') {
    return this.request('/api/v1/ot/checklist', {
      method: 'POST',
      body: JSON.stringify({ bookingId, phase, confirmedBy: this.currentUserId }),
    });
  }

  // Ambulance
  public async getAmbulances() {
    const res = await this.request<any>('/api/v1/ambulance/dispatches');
    return Array.isArray(res) ? res : res.dispatches || [];
  }

  public dispatchAmbulance(payload: any) {
    return this.request('/api/v1/ambulance/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public sendAmbulanceTelemetry(dispatchId: string, latitude: number, longitude: number, speedKmH: number, status: string) {
    return this.request('/api/v1/ambulance/telemetry', {
      method: 'POST',
      body: JSON.stringify({ dispatchId, latitude, longitude, speedKmH, status }),
    });
  }

  // Insurance
  public async getInsuranceClaims() {
    const res = await this.request<any>('/api/v1/insurance/claims');
    return Array.isArray(res) ? res : res.insuranceClaims || [];
  }

  public submitInsuranceClaim(payload: any) {
    return this.request('/api/v1/insurance/claims', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public adjudicateClaim(claimId: string, approvedAmount: number, status: 'APPROVED' | 'REJECTED', notes?: string) {
    return this.request(`/api/v1/insurance/claims/${claimId}/adjudicate`, {
      method: 'POST',
      body: JSON.stringify({ approvedAmount, status, notes }),
    });
  }

  // Blood Bank
  public async getBloodStock() {
    const res = await this.request<any>('/api/v1/blood-bank/stock');
    return Array.isArray(res) ? res : res.bloodStock || [];
  }

  public requestCrossmatch(payload: any) {
    return this.request('/api/v1/blood-bank/crossmatch', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // SOC Incidents
  public async getSocIncidents() {
    const res = await this.request<any>('/api/v1/soc/incidents');
    return Array.isArray(res) ? res : res.incidents || [];
  }

  public logSocIncident(payload: any) {
    return this.request('/api/v1/soc/incidents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Governance
  public initiateAdminRemoval(adminId: string, reason: string) {
    return this.request('/api/v1/admin/removal/initiate', {
      method: 'POST',
      body: JSON.stringify({ targetAdminId: adminId, adminId, reason }),
    });
  }

  public cancelAdminRemoval(adminId: string) {
    return this.request('/api/v1/admin/removal/cancel', {
      method: 'POST',
      body: JSON.stringify({ targetAdminId: adminId, adminId }),
    });
  }

  public onboardAdmin(payload: { adminId?: string; userId?: string; role?: string }) {
    return this.request('/api/v1/admin/onboard', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public setPlatformMode(mode: string) {
    return this.request('/api/v1/admin/platform-mode', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
  }

  public createFacility(payload: { name: string; city?: string; totalBeds?: number; type?: string; nabhLevel?: string }) {
    return this.request('/api/v1/facilities/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Audit
  public async getAuditTrail() {
    const res = await this.request<any>('/api/v1/audit');
    return Array.isArray(res) ? res : res.events || [];
  }

  // AI Services
  public aiNavigate(patientQuery: string) {
    return this.request('/api/v1/ai/navigate', {
      method: 'POST',
      body: JSON.stringify({ patientQuery }),
    });
  }

  public aiReportExtract(documentId: string, textContent: string) {
    return this.request('/api/v1/ai/report-extract', {
      method: 'POST',
      body: JSON.stringify({ documentId, textContent }),
    });
  }

  public aiReportAccept(extractionId: string, notes?: string) {
    return this.request('/api/v1/ai/report-accept', {
      method: 'POST',
      body: JSON.stringify({ extractionId, doctorId: this.currentUserId, notes }),
    });
  }

  public aiSoapDraft(encounterId: string, rawNotes: string) {
    return this.request('/api/v1/ai/soap-draft', {
      method: 'POST',
      body: JSON.stringify({ encounterId, rawNotes }),
    });
  }

  public aiForecast() {
    return this.request('/api/v1/ai/forecast');
  }

  public aiSupportFaq(query: string) {
    return this.request('/api/v1/ai/support-faq', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // ABDM & FHIR
  public getAbdmProfile(patientId: string) {
    return this.request(`/api/v1/abdm/profile/${patientId}`);
  }

  public getFhirBundle(patientId: string) {
    return this.request(`/api/v1/fhir/bundle/${patientId}`);
  }
}

export const api = new ApiClient();
