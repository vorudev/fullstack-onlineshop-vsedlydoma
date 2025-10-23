
import { getAllManufacturers } from '@/lib/actions/manufacturer';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  
  const { manufacturers } = await getAllManufacturers({
    page: 1,
    pageSize: 20, // достаточно для выпадающего списка
    search,
  });
  
  return Response.json(manufacturers);
}