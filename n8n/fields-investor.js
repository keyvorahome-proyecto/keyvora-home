// Build Investor Fields — only non-empty values, keyed by Airtable field name.
const d = $('Score Investor Lead').first().json;
const legacyTypeLabel = { cash_buyer: 'Cash buyer', llc: 'LLC', individual: 'Individual' }[d.legacyType] || '';
const f = {
  'Full name': d.fullName || d.email,
  'Email': d.email,
  'Phone': d.phone,
  'Investor type': legacyTypeLabel,
  'Strategy': d.legacyStrategy,
  'Target budget range': d.budgetRange,
  'Submitted at': d.submittedAt,
  'Status': 'New',
  'Property types': d.propertyTypes,
  'Strategies': d.strategies,
  'Min price': d.minPrice,
  'Max price': d.maxPrice,
  'ZIP codes': d.zips.join(', '),
  'Condition accepted': d.conditionAccepted,
  'Funding': d.funding,
  'Profile complete': d.profileComplete,
  'Score': d.score,
  'Temperature': d.temperature,
  'Submission ID': d.submissionId,
  'Language': d.language,
  'Lead source': d.leadSource
};
const out = {};
for (const [k, v] of Object.entries(f)) {
  if (v === null || v === undefined || v === '' || v === false || (Array.isArray(v) && !v.length)) continue;
  out[k] = v;
}
return [{ json: out }];
