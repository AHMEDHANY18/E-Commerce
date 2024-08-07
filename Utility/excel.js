import ExcelJS from 'exceljs';

export const generateExcel = (applications) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
        { header: 'User Name', key: 'userName', width: 30 },
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Job Title', key: 'jobTitle', width: 30 },
        { header: 'Resume', key: 'resume', width: 50 },
        { header: 'Cover Letter', key: 'coverLetter', width: 50 },
        { header: 'Applied At', key: 'appliedAt', width: 20 }
    ];

    applications.forEach((app) => {
        worksheet.addRow({
            userName: app.user.name,
            userEmail: app.user.email,
            jobTitle: app.job.title,
            resume: app.resume,
            coverLetter: app.coverLetter,
            appliedAt: app.appliedAt.toISOString() // Formatting date as ISO string
        });
    });

    return workbook;
};
