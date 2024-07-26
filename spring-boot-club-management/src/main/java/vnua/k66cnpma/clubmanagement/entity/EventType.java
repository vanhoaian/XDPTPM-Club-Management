package vnua.k66cnpma.clubmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "event_type")
@Data
public class EventType {

    @Id
    @Column(name = "event_type")
    private String eventType;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

}
