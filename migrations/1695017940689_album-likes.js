exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('album_likes', 'fk_al_album.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
  pgm.addConstraint('album_likes', 'fk_al_user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};
