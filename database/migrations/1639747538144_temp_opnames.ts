import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TempOpnames extends BaseSchema {
  protected tableName = 'temp_opnames'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // table.increments('id')
      table.string('kode_brng', 15)
      table.string('kd_bangsal', 15)
      table.integer('stok', 10)
      table.string('tanggal', 15)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
