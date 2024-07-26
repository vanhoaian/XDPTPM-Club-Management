package vnua.k66cnpma.clubmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;


@Entity
@Table(name = "event")
@Data
public class Event {

	@Id
    @Column(name = "id_event")
    private String idEvent;

    @Column(name = "title_event")
    private String titleEvent;

    @Column(name = "description_event")
    private String descriptionEvent;

    @Column(name = "start_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Column(name = "end_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    @Column(name = "event_style")
    private String eventStyle;

    @Column(name = "event_type")
    private String eventType;
    
    @Column(name = "club_id")
    private String clubId;

}
