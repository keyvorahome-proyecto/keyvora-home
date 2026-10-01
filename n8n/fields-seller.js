// Build Seller Fields — only non-empty values, keyed by Airtable field name.
const d = $('Score Seller Lead').first().json;
const f = {
  'Property address': d.address || (d.firstName ? `(sin dirección) ${d.firstName}` : '(sin dirección)'),
  'Contact (phone or email)': d.contactRaw || d.phone || d.email,
  'Reason for selling': d.reason,
  'Submitted at': d.submittedAt,
  'Status': 'New',
  'First name': d.firstName,
  'Last name': d.lastName,
  'Phone': d.phone,
  'Email': d.email,
  'ZIP code': d.zip,
  'Property type': d.propertyType,
  'Condition': d.condition,
  'Situation': d.situation,
  'Timeline': d.timeline,
  'Score': d.score,
  'Temperature': d.temperature,
  'In service area': d.inServiceArea,
  'Submission ID': d.submissionId,
  'Language': d.language,
  'Lead source': d.leadSource
};
const out = {};
for (const [k, v] of Object.entries(f)) {
  if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue;
  out[k] = v;
}
return [{ json: out }];
