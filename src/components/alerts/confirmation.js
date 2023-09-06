import Swal from "sweetalert2"


export default function Confirmation() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    return (
        swalWithBootstrapButtons.fire({
            title: 'Você deseja concluir o cadastro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, eu quero!',
            cancelButtonText: 'Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Cadastrado!',
                    'Cadastro Concluido com sucesso',
                    'success'
                )
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'error'
                )
            }
        })
    )
}