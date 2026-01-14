export function formatDate(dateString: string): string {
    
    const date = new Date(dateString);
    const changeDateFormat = date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return changeDateFormat || '';
}