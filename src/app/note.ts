import Swal from 'sweetalert2';

export function showPopupError(title: string, content: string) {
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

export function showToastNotice(title: string) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'warning',
    title: title,
    showConfirmButton: false,
    timer: 2000
  })
}

export function showToastError(title: string) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: title,
    showConfirmButton: false,
    timer: 2000
  })
}
