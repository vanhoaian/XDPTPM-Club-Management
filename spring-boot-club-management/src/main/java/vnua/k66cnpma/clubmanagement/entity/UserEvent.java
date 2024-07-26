package vnua.k66cnpma.clubmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_event")
@IdClass(UserEventId.class)
@Data
public class UserEvent {

    @Id
    @Column(name = "username")
    private String username;

    @Id
    @Column(name = "id_event")
    private String idEvent;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "note")
    private String note;

    public enum Status {
        Phép_nghỉ,
        Phép_muộn,
        Tham_gia,
        Không_tham_gia,
        Nghỉ_không_phép;

        public static Status fromString(String status) {
            try {
                return Status.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status value: " + status, e);
            }
        }
    }
}
