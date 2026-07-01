export function handleProcessResult(status: number, info: string, userId: string): string {
    if (status === 200) {
        return info;
    }

    if (status === 404 || (info && info.trim().startsWith("<!DOCTYPE"))) {
        return "The requested service endpoint could not be found or the URL is invalid. Please check your request path.";
    }

    const lowerCaseMessage = info ? info.toLowerCase() : "";

    if (lowerCaseMessage.includes("no audio") ||
        lowerCaseMessage.includes("missing file") ||
        lowerCaseMessage.includes("not detected")) {
        return "No audio file was detected. Please ensure the recording was sent properly and try again.";
    }

    if (lowerCaseMessage.includes("multiple") || 
    lowerCaseMessage.includes("multiple files") || 
    lowerCaseMessage.includes("too many files") || 
    lowerCaseMessage.includes("unexpected field") ||
    lowerCaseMessage.includes("unexpected_file")) { 
    return "Multiple files detected. Please upload only one audio file at a time.";
}

    if (lowerCaseMessage.includes("25mb") ||
        lowerCaseMessage.includes("too large") ||
        lowerCaseMessage.includes("exceeds")) {
        return "The audio file size exceeds the allowed limit. The system only supports files up to 25MB.";
    }

    if (lowerCaseMessage.includes("format") ||
        lowerCaseMessage.includes("invalid type") ||
        lowerCaseMessage.includes("unsupported")) {
        return "The file format is not supported. Please provide a standard audio recording (MP3, WAV, OGG, etc.).";
    }

    if (lowerCaseMessage.includes("empty") ||
        lowerCaseMessage.includes("no speech") ||
        lowerCaseMessage.includes("silent")) {
        return lowerCaseMessage;
    }

    if (lowerCaseMessage.includes("userid") ||
        lowerCaseMessage.includes("unauthorized") ||
        !userId) {
        return "System error: Unable to perform the operation for the current user ID.";
    }

    return lowerCaseMessage || "The operation failed due to a temporary internal system error. Please try again in a few minutes.";
}