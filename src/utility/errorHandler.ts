import Swal from "sweetalert2";

const handleError = (error: any) => {
  console.error(error); // Logging error for debugging

  let message = "Terjadi kesalahan. Silakan coba lagi.";
  let title = "Error";
  let icon: "error" | "warning" | "info" = "error";

  if (error.response) {
    const { status, data, statusText } = error.response;

    switch (true) {
      case status >= 500:
        // Error server (500 and above)
        message = "Terjadi kesalahan di server. Silakan coba lagi nanti.";
        break;
      case status === 404:
        // Error Not Found
        message = "Sumber daya yang Anda minta tidak ditemukan.";
        break;
      case status === 403:
        // Error Forbidden
        message = "Anda tidak memiliki izin untuk melakukan aksi ini.";
        break;
      case status === 401:
        // Error Unauthorized
        message = "Anda harus login untuk melakukan aksi ini.";
        break;
      case status === 422:
        // Validation Error
        message = data?.message || "Data yang Anda masukkan tidak valid.";
        break;
      default:
        // Error lainnya
        message = data?.message
          ? data.message
          : `Terjadi kesalahan: ${statusText}`;
        break;
    }
  } else if (error.request) {
    // Error pada request (contoh: masalah koneksi)
    message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    icon = "warning";
  } else if (error.message) {
    // Error lainnya (contoh: kesalahan pada konfigurasi)
    message = error.message;
  }

  // Tampilkan error menggunakan SweetAlert2
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
  });
};

export default handleError;
