package vnua.k66cnpma.clubmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vnua.k66cnpma.clubmanagement.entity.Event;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
	
	Optional<Event> findById(String idEvent);
    List<Event> findAll();
    void deleteById(String idEvent);
    <S extends Event> S save(S entity);
    List<Event> findByClubId(String clubId);
    List<Event> findByIdEventIn(List<String> idEvents);

}
