import Swal from "sweetalert2";

export const successMessage = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "Sucesso!",
    text: message,
    confirmButtonColor: "#2563eb",
  });
};

export const errorMessage = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Erro!",
    text: message,
    confirmButtonColor: "#ef4444",
  });
};
