export const normalizeCategory = (c: any) => ({
  id: c.id ?? c.categoryId ?? null,
  categoryName: c.categoryName ?? c.name ?? c.category_name ?? '',
});

export const normalizeSubcategory = (s: any) => ({
  id: s.id ?? s.subcategoryId ?? null,
  subcategoryName: s.subCategoryName ?? s.subcategoryName ?? s.name ?? '',
  categoryId: s.categoryId ?? s.category_id ?? null,
});

export const normalizeContact = (c: any) => ({
  id: c.id ?? c.contactId ?? null,
  name: c.name ?? c.fullName ?? c.full_name ?? '',
  email: c.email ?? '',
  phone: c.phone ?? '',
  company: c.company ?? '',
  notes: c.notes ?? '',
});

export const normalizeLead = (l: any) => ({
  id: l.id ?? l.leadId ?? null,
  leadName: l.leadName ?? l.name ?? '',
  contactId: l.contactId ?? l.contact_id ?? null,
  contactName: l.contactName ?? l.contactName ?? '',
  status: l.status ?? 'New',
  source: l.source ?? '',
  notes: l.notes ?? '',
  categoryId: l.categoryId ?? null,
  subcategoryId: l.subcategoryId ?? null,
});