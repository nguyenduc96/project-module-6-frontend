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

export function successAlert() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: 'success',
    title: 'Add success'
  });
}
