// Function to wrap text to a specified limit with ellipsis if necessary
export const wrapText = (text, limit) => {
    if (text?.length <= limit || text?.length < 16) return text; // Return text if within limit or shorter than 16 characters
    const wpText = text?.slice(0, limit - 1 || 14); // Slice text to the specified limit or default to 14 characters
    return `${wpText}...`; // Add ellipsis to the sliced text
};

// Function to format a date into a readable string
export const formatDate = (date) => {
    const newDate = new Date(date); // Convert input to Date object
    const day = newDate.getDate(); // Extract day from Date object
    const month = newDate.toLocaleString('default', { month: 'long' }); // Extract month in long format
    const year = newDate.getFullYear(); // Extract year from Date object

    return `${day} ${month} ${year}`; // Return formatted date string
};

// Function to format a number into K or M notation
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // Convert to million with one decimal place
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'; // Convert to thousand with one decimal place
    } else {
        return num?.toString(); // Return number as string if less than 1000
    }
};

// Function to check the file type and return image or video
export const checkFileType = (file) => {
    if (file.type.includes("image")) {
        return "image"; // Return "image" if file type includes "image"
    } else if (file.type.includes("video")) {
        return "video"; // Return "video" if file type includes "video"
    } else {
        return "invalid file"; // Return "invalid file" for other file types
    }
};

// Function to verify if the input text is a valid email address 
export const isValidEmail = (text) => {
    // Regular expression for validating email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
};

