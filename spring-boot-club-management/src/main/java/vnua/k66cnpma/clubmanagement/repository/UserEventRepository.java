package vnua.k66cnpma.clubmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vnua.k66cnpma.clubmanagement.entity.UserEvent;
import vnua.k66cnpma.clubmanagement.entity.UserEventId;

import java.util.List;

public interface UserEventRepository extends JpaRepository<UserEvent, UserEventId> {
    List<UserEvent> findByUsername(String username);
}