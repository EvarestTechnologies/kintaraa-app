/**
 * Template Helpers
 * Shared utilities for filling message templates
 */

/**
 * Get default template variables for message composition
 */
export function getDefaultTemplateVariables(
  recipientName: string,
  caseId: string
): Record<string, string> {
  return {
    survivor_name: recipientName,
    provider_name: 'Healthcare Provider', // TODO: Get from auth context
    case_number: caseId,
    organization: 'Kintaraa Health System',
    contact_number: '+254-XXX-XXXX', // TODO: Get from config
    emergency_number: '999',
    appointment_date: 'TBD',
    appointment_time: 'TBD',
    location: 'TBD',
    update_details: 'Your case status has been updated',
    action: 'proceed with the next steps',
  };
}
