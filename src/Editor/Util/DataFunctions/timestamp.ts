// Found on https://gist.github.com/hurjas/2660489 by GitHub user hurjas

/**
 * Return a timestamp with the format "m-d-yyyy_h-MM-ss"
 * @returns Formatted timestamp string
 */
function timeStamp(): string {
    // Create a date object with the current time
    const now = new Date();

    // Create an array with the current month, day and time
    const date: number[] = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

    // Create an array with the current hour, minute and second
    const time: number[] = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // If seconds and minutes are less than 10, add a zero
    const formattedTime: string[] = time.map((value, index) => {
        // Add leading zero to minutes and seconds if less than 10
        if (index > 0 && value < 10) {
            return "0" + value;
        }
        return value.toString();
    });

    // Return the formatted string
    return date.join("-") + "_" + formattedTime.join("-");
}

export default timeStamp;