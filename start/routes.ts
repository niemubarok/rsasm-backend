import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return "it's work"
})

Route.group(() => {
  Route.post('/test', 'BookingController.test')

  // REGISTER
  Route.post('/register', 'AuthController.register').middleware('auth')
  //LOGIN

  // PASIEN
  Route.get('/pasien', 'PasiensController.index')
  Route.post('/pasien', 'PasiensController.index').middleware('getPasien')
  // Route.post('/pasien/store', 'PasiensController.store')

  //jika pasien baru maka akan ke middleware dulu untuk di input ke table pasien
  Route.post('/pendaftaran', 'BookingController.store').middleware('storePasienBaru')

  // DOKTER
  Route.post('dokter', 'DokterController.index')
  Route.post('poli', 'PoliController.index')

  //Setting
  Route.get('settings', 'SettingsController.index')
}).prefix('/api')

//STOCK OPNAME
Route.group(() => {
  Route.get('/depo', 'OpnameController.depo')
  Route.get('/obat', 'OpnameController.obat')
  Route.post('/store', 'OpnameController.store')
}).prefix('/api/opname')
