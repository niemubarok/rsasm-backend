import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return "it's work"
})

Route.group(() => {
  Route.get('/test', 'PendaftaranPasienLamaController.test')
  Route.get('/pasien', 'PasiensController.index')
  Route.post('/pasien', 'PasiensController.index')
  Route.post('/pendaftaran/pasien-lama', 'PendaftaranPasienLamaController.store').middleware(
    'getPasien'
  )
  // Route.post('/pendaftaran/pasien-baru', 'PendaftaranController.pasienBaru')
}).prefix('/api')
