import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/pasien', 'PasiensController.index')
    Route.post('/pasien', 'PasiensController.index')
    Route.post('/registrasi/pasien-lama', 'RegistrasiController.pasienLama')
    Route.post('/registrasi/pasien-baru', 'RegistrasiController.pasienBaru')
}).prefix('/api')
