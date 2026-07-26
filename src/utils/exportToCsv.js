export const exportToCsv = (filename, data, headers) => {
  if (!data || !data.length) return;

  const headerKeys = headers ? Object.keys(headers) : Object.keys(data[0]);
  const headerLabels = headers ? Object.values(headers) : headerKeys;

  const csvRows = [];
  csvRows.push(headerLabels.join(","));

  for (const row of data) {
    const values = headerKeys.map((key) => {
      let val = key.split(".").reduce((obj, k) => (obj ? obj[k] : undefined), row);
      if (val === undefined || val === null) val = "";
      const escaped = ("" + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
