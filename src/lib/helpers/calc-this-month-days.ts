export function calcThisMonthDays() {
	const currentDate = new Date();

	const month = currentDate.getMonth() + 1;
	const year = currentDate.getFullYear();
	const d = new Date(year, month, 0);
	return d.getDate();
}
