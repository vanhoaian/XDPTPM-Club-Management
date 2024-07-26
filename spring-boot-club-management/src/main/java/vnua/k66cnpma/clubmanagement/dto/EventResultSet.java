package vnua.k66cnpma.clubmanagement.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.Date;

@JsonPropertyOrder({
        "id_event",
        "title_event",
        "description_event",
        "start_time",
        "end_time",
        "event_style",
        "event_type",
        "clubId"
})
public interface EventResultSet {
    String getId_event();
    String getTitle_event();
    String getDescription_event();
    Date getStart_time();
    Date getEnd_time();
    String getEvent_style();
    String getEvent_type();
	String getClubId();
}
