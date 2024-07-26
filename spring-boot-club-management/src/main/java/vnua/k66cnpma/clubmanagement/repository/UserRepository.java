package vnua.k66cnpma.clubmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import vnua.k66cnpma.clubmanagement.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
	Optional<User> findById(String username);
    List<User> findAll();
    void deleteById(String username);
    <S extends User> S save(S entity);
    List<User> findByClubId(String clubId);
    
}

