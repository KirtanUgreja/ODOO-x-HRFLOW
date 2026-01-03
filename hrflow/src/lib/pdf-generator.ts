import jsPDF from 'jspdf'

interface SalaryData {
  salary: any
  banking: any
  user: any
}

export function generateSalarySlipPDF(data: SalaryData) {
  const pdf = new jsPDF()
  const { salary, banking, user } = data
  
  // Header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('SALARY SLIP', 105, 20, { align: 'center' })
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Dayflow Technologies', 105, 30, { align: 'center' })
  
  // Employee Details
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Employee Details:', 20, 50)
  
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Name: ${user?.full_name || 'N/A'}`, 20, 60)
  pdf.text(`Email: ${user?.email || 'N/A'}`, 20, 70)
  pdf.text(`Account: ${banking?.account_number ? `****${banking.account_number.slice(-4)}` : 'Not Set'}`, 20, 80)
  pdf.text(`Pay Period: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, 20, 90)
  
  // Earnings Section
  pdf.setFont('helvetica', 'bold')
  pdf.text('EARNINGS', 20, 110)
  pdf.line(20, 115, 90, 115)
  
  const earnings = [
    ['Basic Salary', Number(salary?.basic_salary || 0)],
    ['HRA', Number(salary?.hra || 0)],
    ['Standard Allowance', Number(salary?.standard_allowance || 0)],
    ['Performance Bonus', Number(salary?.performance_bonus || 0)],
    ['LTA', Number(salary?.lta || 0)],
    ['Fixed Allowance', Number(salary?.fixed_allowance || 0)]
  ]
  
  let yPos = 125
  pdf.setFont('helvetica', 'normal')
  earnings.forEach(([label, amount]) => {
    pdf.text(label as string, 20, yPos)
    pdf.text(`₹${(amount as number).toLocaleString()}`, 80, yPos, { align: 'right' })
    yPos += 10
  })
  
  // Total Earnings
  pdf.setFont('helvetica', 'bold')
  pdf.text('Total Earnings:', 20, yPos + 5)
  pdf.text(`₹${Number(salary?.gross_salary || 0).toLocaleString()}`, 80, yPos + 5, { align: 'right' })
  
  // Deductions Section
  pdf.text('DEDUCTIONS', 110, 110)
  pdf.line(110, 115, 180, 115)
  
  const deductions = [
    ['Employee PF', Number(salary?.employee_pf || 0)],
    ['Professional Tax', Number(salary?.professional_tax || 0)],
    ['TDS', 0]
  ]
  
  yPos = 125
  pdf.setFont('helvetica', 'normal')
  deductions.forEach(([label, amount]) => {
    pdf.text(label as string, 110, yPos)
    pdf.text(`₹${(amount as number).toLocaleString()}`, 170, yPos, { align: 'right' })
    yPos += 10
  })
  
  // Total Deductions
  const totalDeductions = Number(salary?.employee_pf || 0) + Number(salary?.professional_tax || 0)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Total Deductions:', 110, yPos + 5)
  pdf.text(`₹${totalDeductions.toLocaleString()}`, 170, yPos + 5, { align: 'right' })
  
  // Net Salary
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('NET SALARY:', 20, yPos + 25)
  pdf.text(`₹${Number(salary?.net_salary || 0).toLocaleString()}`, 170, yPos + 25, { align: 'right' })
  
  // Footer
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.text('This is a computer generated salary slip.', 105, 280, { align: 'center' })
  
  return pdf
}