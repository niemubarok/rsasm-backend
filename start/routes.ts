import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return "it's work"
})

Route.group(() => {
  Route.post('/test', 'BookingController.test')

  // PASIEN
  Route.get('/pasien', 'PasiensController.index')
  Route.post('/pasien', 'PasiensController.index').middleware('getPasien')
  Route.post('/pasien/store', 'PasiensController.store')
  Route.post('/pendaftaran', 'BookingController.store').middleware('storePasienBaru')
  // Route.post('/pendaftaran/pasien-baru', 'BookingController.store').middleware('storePasienBaru')

  // DOKTER
  Route.post('dokter', 'DokterController.index')
  Route.post('poli', 'PoliController.index')

  //Setting
  Route.get('settings', 'SettingsController.index')
}).prefix('/api')
