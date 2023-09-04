exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'Varchar(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'SMALLINT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });

  pgm.sql(`
  ALTER TABLE songs ADD CONSTRAINT fk_songs_albums FOREIGN KEY (album_id) REFERENCES albums(id);`);
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
