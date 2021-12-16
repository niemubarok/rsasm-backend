import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Settings extends BaseSchema {
  protected tableName = 'web_settings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('primary_color', 50)
      table.string('secondary_color', 50)
      table.boolean('is_newpatientform_active')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
