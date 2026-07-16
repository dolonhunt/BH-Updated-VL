import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const employees = await db.employee.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json(employees)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const employee = await db.employee.create({ data: body })
    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create employee:', error)
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 })
  }
}
