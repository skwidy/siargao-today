import { NextResponse } from 'next/server';
import { 
  instructorsTable, 
  type Instructor, 
  type InstructorStatus,
  getFieldValue, 
  getSingleSelectField,
  getMultipleSelectField,
  getRatingField,
  getInstagramHandle,
  getWhatsAppNumber
} from '@/lib/airtable';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await instructorsTable.find(params.id);

    if (!record) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Log raw field values
    console.log(`Instructor ID: ${record.id}`);
    console.log('Raw field values:');
    console.log(`- name: ${record.get('name')} (${typeof record.get('name')})`);
    console.log(`- tagline: ${record.get('tagline')} (${typeof record.get('tagline')})`);
    console.log(`- status: ${record.get('status')} (${typeof record.get('status')})`);
    console.log(`- rating: ${record.get('rating')} (${typeof record.get('rating')})`);
    console.log(`- locations: ${JSON.stringify(record.get('locations'))} (${Array.isArray(record.get('locations')) ? 'array' : typeof record.get('locations')})`);
    console.log(`- tags: ${JSON.stringify(record.get('tags'))} (${Array.isArray(record.get('tags')) ? 'array' : typeof record.get('tags')})`);
    console.log(`- instagram: ${record.get('instagram')} (${typeof record.get('instagram')})`);
    console.log(`- whatsapp: ${record.get('whatsapp')} (${typeof record.get('whatsapp')})`);

    const instructorStatusOptions: InstructorStatus[] = ['Active', 'Inactive', 'Pending'];
    const locationOptions: string[] = ['Cloud 9', 'Quiksilver', 'Pacifico', 'General Luna', 'Other'];
    const tagOptions: string[] = ['Beginner', 'Intermediate', 'Advanced', 'Kids', 'Private', 'Group'];

    // Process fields with helper functions
    const instagram = getInstagramHandle(record, 'instagram');
    const whatsapp = getWhatsAppNumber(record, 'whatsapp');
    
    console.log('Processed social values:');
    console.log(`- instagram: ${instagram}`);
    console.log(`- whatsapp: ${whatsapp}`);

    const instructor: Instructor = {
      id: record.id,
      name: getFieldValue(record, 'name', ''),
      tagline: getFieldValue(record, 'tagline', ''),
      status: getSingleSelectField(record, 'status', instructorStatusOptions),
      rating: getRatingField(record, 'rating'),
      locations: getMultipleSelectField(record, 'locations', locationOptions),
      tags: getMultipleSelectField(record, 'tags', tagOptions),
      instagram,
      whatsapp,
    };

    // Log processed values
    console.log('Processed values:');
    console.log(JSON.stringify(instructor, null, 2));

    return NextResponse.json(instructor);
  } catch (error) {
    console.error('Error fetching instructor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    );
  }
} 