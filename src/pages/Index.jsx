import React, { useState, useEffect } from "react";
import { ChakraProvider, Grid, GridItem, Box, Text, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const EventItem = ({ title, days, isPast, onRemove }) => {
  return (
    <Box p={4} color="white" bg={isPast ? "yellow.500" : "green.500"} borderRadius="md" textAlign="center">
      <Text fontSize="sm" fontWeight="bold">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>{title}</Box>
          <Button size="xs" colorScheme="red" onClick={onRemove}>
            Remove
          </Button>
        </Box>
      </Text>
      <Text fontSize="5xl" fontWeight="extrabold">
        {Math.abs(days)}
      </Text>
      <Text fontSize="sm">{isPast ? "days since" : "days till"}</Text>
    </Box>
  );
};

const Index = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleRemoveEvent = (index) => {
    const newEvents = events.filter((_, i) => i !== index);
    setEvents(newEvents);
  };
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const toast = useToast();

  const handleAddEvent = () => {
    const today = new Date();
    const eventDate = new Date(newEventDate);
    const differenceInTime = eventDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (isNaN(differenceInDays)) {
      toast({
        title: "Invalid date",
        description: "Please enter a valid date for the event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newEvent = {
      title: newEventTitle,
      days: differenceInDays,
      isPast: differenceInDays < 0,
    };

    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setNewEventDate("");
  };

  return (
    <ChakraProvider>
      <Box bg="teal.800" minH="100vh" color="white" p={5}>
        <FormControl id="event-form" mb={4}>
          <FormLabel>Add an Event</FormLabel>
          <Input placeholder="Title" mb={2} value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
          <Input placeholder="Date" type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
          <Button leftIcon={<FaPlus />} colorScheme="teal" variant="outline" mt={2} onClick={handleAddEvent}>
            Add Event
          </Button>
        </FormControl>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {events.map((event, index) => (
            <GridItem key={index}>
              <EventItem title={event.title} days={event.days} isPast={event.isPast} onRemove={() => handleRemoveEvent(index)} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
