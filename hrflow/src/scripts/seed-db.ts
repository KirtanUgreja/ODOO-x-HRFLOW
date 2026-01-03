import { db } from '../lib/db'
import { users, profiles, personalInfo, bankingInfo, skills, attendance, leaveRequests, salaryInfo } from '../db/schema'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
    try {
        console.log('Starting database seeding...')

        // Create a sample user
        const hashedPassword = await bcrypt.hash('password123', 10)
        
        const [user] = await db.insert(users).values({
            email: 'john.doe@dayflow.com',
            password_hash: hashedPassword,
            full_name: 'John Doe',
            phone: '+1234567890'
        }).returning()

        console.log('Created user:', user.id)

        // Create profile
        await db.insert(profiles).values({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            department: 'Engineering',
            company: 'Dayflow',
            location: 'San Francisco, CA',
            about: 'Senior Software Engineer with 5+ years of experience',
            job_love: 'Building scalable web applications',
            interests: 'Technology, Music, Travel'
        })

        // Create personal info
        await db.insert(personalInfo).values({
            user_id: user.id,
            date_of_birth: '1990-05-15',
            nationality: 'American',
            gender: 'Male',
            marital_status: 'Single',
            personal_email: 'john.personal@gmail.com',
            residing_address: '123 Main St, San Francisco, CA 94102'
        })

        // Create banking info
        await db.insert(bankingInfo).values({
            user_id: user.id,
            bank_name: 'Chase Bank',
            account_number: '1234567890',
            ifsc_code: 'CHAS0001234'
        })

        // Create skills
        const skillsList = [
            { skill_name: 'JavaScript', proficiency_level: 'Expert', years_of_experience: '5' },
            { skill_name: 'React', proficiency_level: 'Expert', years_of_experience: '4' },
            { skill_name: 'Node.js', proficiency_level: 'Advanced', years_of_experience: '3' },
            { skill_name: 'Python', proficiency_level: 'Intermediate', years_of_experience: '2' }
        ]

        for (const skill of skillsList) {
            await db.insert(skills).values({
                user_id: user.id,
                ...skill
            })
        }

        // Create salary info
        await db.insert(salaryInfo).values({
            user_id: user.id,
            basic_salary: '50000',
            hra: '20000',
            standard_allowance: '5000',
            performance_bonus: '10000',
            lta: '3000',
            fixed_allowance: '2000',
            employee_pf: '6000',
            professional_tax: '200',
            gross_salary: '90000',
            net_salary: '83800',
            ctc: '1080000',
            effective_from: '2024-01-01'
        })

        // Create attendance records for the last 10 days
        const today = new Date()
        for (let i = 0; i < 10; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            
            await db.insert(attendance).values({
                user_id: user.id,
                date: date.toISOString().split('T')[0],
                check_in_time: '09:00:00',
                check_out_time: i === 0 ? null : '18:00:00', // Today not checked out yet
                status: i < 8 ? 'Present' : (i === 8 ? 'Late' : 'Absent')
            })
        }

        // Create leave requests
        const leaveRequestsList = [
            {
                leave_type: 'Sick Leave',
                start_date: '2024-01-15',
                end_date: '2024-01-16',
                days: '2',
                reason: 'Flu symptoms',
                status: 'Approved'
            },
            {
                leave_type: 'Casual Leave',
                start_date: '2024-02-10',
                end_date: '2024-02-10',
                days: '1',
                reason: 'Personal work',
                status: 'Pending'
            },
            {
                leave_type: 'Earned Leave',
                start_date: '2024-03-01',
                end_date: '2024-03-05',
                days: '5',
                reason: 'Vacation',
                status: 'Approved'
            }
        ]

        for (const leave of leaveRequestsList) {
            await db.insert(leaveRequests).values({
                user_id: user.id,
                ...leave
            })
        }

        console.log('Database seeded successfully!')
        console.log('Sample user credentials:')
        console.log('Email: john.doe@dayflow.com')
        console.log('Password: password123')

    } catch (error) {
        console.error('Error seeding database:', error)
    }
}

// Run the seed function
seedDatabase().then(() => {
    console.log('Seeding completed')
    process.exit(0)
}).catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
})