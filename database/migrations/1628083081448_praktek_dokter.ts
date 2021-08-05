import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PraktekDokter extends BaseSchema {
  protected tableName = 'praktek_dokter'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('kd_dokter', 20)
        .notNullable()
        .references('jadwal.kd_dokter')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.enum('hari', ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'AKHAD'])
      table.boolean('isPraktek')
      table.charset('latin1')
      table.collate('latin1_swedish_ci')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
