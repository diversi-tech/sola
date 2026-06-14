export function handleProcessResult(status: string, info: string, userId: string): string {
    if (status === 'success') {
        return info; 
    }

    // Fixed variable name according to review feedback
    const lowerCaseMessage = info.toLowerCase();

    // All error messages changed to English according to review feedback
    if (lowerCaseMessage.includes("no audio") || lowerCaseMessage.includes("missing file")) {
        return "No audio file was detected. Please ensure the recording was sent properly and try again.";
    }

    if (lowerCaseMessage.includes("25mb") || lowerCaseMessage.includes("too large")) {
        return "The audio file size exceeds the allowed limit. The system only supports files up to 25MB.";
    }

    if (lowerCaseMessage.includes("format") || lowerCaseMessage.includes("invalid type")) {
        return "The file format is not supported. Please provide a standard audio recording.";
    }

    if (lowerCaseMessage.includes("empty") || lowerCaseMessage.includes("no speech")) {
        return "No speech was detected in the audio file. Please ensure the recording is clear and try again.";
    }

    if (lowerCaseMessage.includes("userid") || !userId) {
        return "System error: Unable to perform the operation for the current user ID.";
    }

    return "The operation failed due to a temporary internal system error. Please try again in a few minutes.";
}