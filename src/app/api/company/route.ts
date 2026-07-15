import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let config = await db.companyConfig.findUnique({ where: { id: 'default' } })
    if (!config) {
      // Create default if not exists
      config = await db.companyConfig.create({ data: { id: 'default' } })
    }
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to fetch company config:', error)
    return NextResponse.json({ error: 'Failed to fetch company config' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const config = await db.companyConfig.upsert({
      where: { id: 'default' },
      update: body,
      create: { id: 'default', ...body },
    })
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to update company config:', error)
    return NextResponse.json({ error: 'Failed to update company config' }, { status: 500 })
  }
}
