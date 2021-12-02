import Swal from 'sweetalert2';

export function showToastError(title: string, content: string) {
  Swal.fire({
    toast: true,
    icon: 'error',
    title: title,
    text: content,
  })
}

export function showToastSuccess(title: string) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: title,
    showConfirmButton: false,
    timer: 2000
  })
}
