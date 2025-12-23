import dayjs from 'dayjs';

export interface ExcelFileNameOptions {
  startDate?: string | null;
  endDate?: string | null;
  timeFilterType?: string;
}

export const generateExcelFileName = (
  baseName: string,
  options?: ExcelFileNameOptions
): string => {
  if (options?.startDate && options?.endDate) {
    const startDateFormatted = dayjs(options.startDate).format('YYYYMMDD');
    const endDateFormatted = dayjs(options.endDate).format('YYYYMMDD');

    if (startDateFormatted === endDateFormatted) {
      return `${baseName}_${startDateFormatted}`;
    }

    return `${baseName}_${startDateFormatted}_${endDateFormatted}`;
  }

  if (options?.timeFilterType) {
    return `${baseName}_${options.timeFilterType}`;
  }

  return baseName;
};

export const downloadExcelFile = (
  data: Blob,
  fileName: string = 'export',
  options?: ExcelFileNameOptions
): void => {
  if (!data) {
    throw new Error('No data available for export');
  }

  try {
    const formattedFileName = generateExcelFileName(fileName, options);

    const fileURL = window.URL.createObjectURL(data);
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;

    const fullFileName = `${formattedFileName}.xlsx`;
    fileLink.download = fullFileName;

    fileLink.click();

    window.URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
