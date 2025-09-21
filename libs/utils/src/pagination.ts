import { PaginationRequestDto } from '@app/models';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyPagination<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  dto: PaginationRequestDto<string>
) {
  const { page = 1, limit = 10, search, order = 'ASC', orderBy, searchFields = [] } = dto;

  // --- Search logic ---
  if (search && searchFields.length > 0) {
    const conditions = searchFields
      .map(field => {
        if (field.includes('.')) {
          // relation field, e.g., tags.name
          return `${field} ILIKE :search`;
        } else {
          return `${qb.alias}.${field} ILIKE :search`;
        }
      })
      .join(' OR ');

    qb.andWhere(`(${conditions})`, { search: `%${search}%` });
  }

  // ✅ Apply dynamic ordering
  if (orderBy) {
    qb.orderBy(`${qb.alias}.${orderBy}`, order);
  }

  // --- Pagination ---
  qb.skip((page - 1) * limit).take(limit);

  return qb;
}
