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
      table.string('hari')
      table.boolean('isPraktek')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.charset('latin1')
      table.collate('latin1_swedish_ci')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
