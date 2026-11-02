/**
 * @file packages/policy-engine/src/consent-evaluator.ts
 * Scoped Patient Consent Evaluation Engine
 * Derived from Blueprint Section 09 and Implementation Plan Section 09.
 */

import { ConsentGrant, DocumentCategory } from '@svasthnexis/shared-types';

export interface ConsentEvaluationRequest {
  patientId: string;
  recipientId: string; // Doctor ID or Facility ID
  requestedCategory: DocumentCategory;
  requestedDocumentId?: string;
  declaredPurpose: string;
  currentTimeIso?: string;
  activeConsents: ConsentGrant[];
}

export interface ConsentEvaluationResult {
  isGranted: boolean;
  matchedConsentId?: string;
  reason: string;
  evaluatedAt: string;
}

/**
 * Dynamically evaluates whether access to a medical document is authorized under scoped consent
 */
export function evaluateConsent(request: ConsentEvaluationRequest): ConsentEvaluationResult {
  const now = request.currentTimeIso ? new Date(request.currentTimeIso) : new Date();
  const nowIso = now.toISOString();

  for (const consent of request.activeConsents) {
    // 1. Validate data subject
    if (consent.dataSubjectId !== request.patientId) {
      continue;
    }

    // 2. Validate recipient (direct match or wildcard facility match)
    if (consent.recipientId !== request.recipientId && consent.recipientId !== '*') {
      continue;
    }

    // 3. Validate status
    if (consent.status !== 'GRANTED' && consent.status !== 'ACTIVE') {
      continue;
    }

    // 4. Validate temporal validity window
    const validFrom = new Date(consent.validFrom);
    const validUntil = new Date(consent.validUntil);
    if (now < validFrom || now > validUntil) {
      continue; // Expired or not yet valid
    }

    // 5. Validate purpose
    if (consent.purpose !== request.declaredPurpose && consent.purpose !== 'CONSULTATION') {
      continue;
    }

    // 6. Validate scope: check document category
    if (!consent.scopeCategories.includes(request.requestedCategory)) {
      continue;
    }

    // 7. Validate specific document whitelist (if defined)
    if (consent.documentIds && consent.documentIds.length > 0) {
      if (!request.requestedDocumentId || !consent.documentIds.includes(request.requestedDocumentId)) {
        continue;
      }
    }

    // All conditions satisfied: Consent allows access
    return {
      isGranted: true,
      matchedConsentId: consent.id,
      reason: `Authorized by consent grant ${consent.id} for purpose '${consent.purpose}'`,
      evaluatedAt: nowIso,
    };
  }

  return {
    isGranted: false,
    reason: `Access denied. No active, unexpired consent grant permits recipient '${request.recipientId}' to access category '${request.requestedCategory}' for purpose '${request.declaredPurpose}'`,
    evaluatedAt: nowIso,
  };
}
