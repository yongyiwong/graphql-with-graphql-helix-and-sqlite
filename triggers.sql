DROP TRIGGER IF EXISTS insert_after_artists_trigger;
CREATE TRIGGER insert_after_artists_trigger AFTER INSERT ON artists
BEGIN
INSERT INTO ArtistLog (OperationType, ArtistId, name )
         VALUES('INSERT', NEW.ArtistId,NEW.name);
END



DROP TRIGGER IF EXISTS update_after_artists_trigger;
CREATE TRIGGER update_after_artists_trigger AFTER UPDATE ON artists
BEGIN
	INSERT INTO ArtistLog (OperationType, ArtistId, name )
			 VALUES('UPDATE', OLD.ArtistId, NEW.name);

END