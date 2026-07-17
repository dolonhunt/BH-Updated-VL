import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { logger } from '@/shared/lib/logger'

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025'
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const employee = await db.employee.findUnique({ where: { id } })
    if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(employee)
  } catch (err) {
    logger.error('Failed to fetch employee', { route: `/api/employees/${id}`, method: 'GET', error: err })
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const employee = await db.employee.update({ where: { id }, data: body })
    return NextResponse.json(employee)
  } catch (err) {
    if (isNotFoundError(err)) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }
    logger.error('Failed to update employee', { route: `/api/employees/${id}`, method: 'PUT', error: err })
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await db.employee.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    if (isNotFoundError(err)) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }
    logger.error('Failed to delete employee', { route: `/api/employees/${id}`, method: 'DELETE', error: err })
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 })
  }
}
