
exports.up = (pgm) => {
  pgm.createTable('otp', {
    id: 'id',
    name: { type: 'varchar(1000)', notNull: true },
    email: {type: 'varchar(1000)', notNull: true},
    password_hash: { type: 'varchar(1000)', notNull: true},
    otp: { type: 'varchar(1000)', notNull: true},
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
    pgm.dropTable('otp', {
        ifExists: true,
    })
};