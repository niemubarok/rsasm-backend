import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return "it's work"
})

Route.group(() => {
  Route.post('/test', 'PendaftaranPasienLamaController.test').middleware('getPasien')

  // PASIEN
  Route.get('/pasien', 'PasiensController.index')
  Route.post('/pasien', 'PasiensController.index').middleware('getPasien')
  Route.post('/pasien/store', 'PasiensController.store')
  Route.post('/pendaftaran/pasien-lama', 'PendaftaranPasienLamaController.store').middleware(
    'getPasien'
  )
  // Route.post('/pendaftaran/pasien-baru', 'PendaftaranController.pasienBaru')

  // DOKTER
  Route.post('dokter', 'DokterController.index')
  Route.post('poli', 'PoliController.index')
}).prefix('/api')
