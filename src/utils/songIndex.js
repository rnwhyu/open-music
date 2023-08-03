const mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumid,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumid,
});
module.exports = { mapDBToSongModel };