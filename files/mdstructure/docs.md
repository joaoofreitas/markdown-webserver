## ESP32 Ultra Low Power Mode - Documentation
#### João Freitas

### 1. What is ULP?

ULP or _Ultra Low Power Mode_ is a feature of the ESP32 microcontroller.
It allows the developer to power up the microcontroller with the least power needed for it to do a certain task.

With it, it's possible to make a battery supplied project last way longer comparing to the regular mode.

We can call this mode also by deep _sleep mode_.

### 2. What can the ESP32 do in _deep sleep_?

1. Read and Write pins
2. Read analog signals from 0 to 3.3V with a resolution of 12-bits (0-4095)
3. Comunicate via I2C
4. Wake up the main processor.

### 3. How does it work?

##### The architecture of the ESP32

The ESP32 architecture is quite simple.
It's composed by Wi-Fi and Bluetooth Modules for wireless comunication, a Radio that recieves and sends data using those communication interfaces.
The cryptographic hardware acceleration. The embeed flash module. And the importante part here. The main core and memories of the ESP and the RTC and Low Power Subsystem.
![Architecture](mdstructure/arch.png)

As you can see, in the _RTC and low-power subsystem_ theres 3 parts.
1. PMU (Phasor Mesurement Unit)
2. ULP co-processor
3. Recovery Memory

For us to be able to use the _ULP mode_ we need to program this part of the ESP32.
More specificaly the _ULP_ co-processor unit that we will use to control the points specified in the __Chapter 2__ and the 8KB memory that comes along with it.

> _8KB of memory may not seem a lot, but it's more that enough for what we need._ _An Arduino Uno for example just has 2KB that is 4 times less that this recovery memory._


### 4. Power Consumption in _Deep Sleep Mode_

Here's an example of power consumption used in a _sketch_ that powers up an LED in Active Mode and then goes to deep sleep in a cycle of 1 second each:

> __Example of fluxogram:__

> START --> Turns on the LED with a delay of 1 second --> Turns off the LED and goes to sleep for one second --> RESTARTS

- Current used by ESP32 during __Active Mode__: 50 mA
- Current used by ESP32 during __Deep Sleep Mode__ : 0.01mA


A normal _blink sketch_ in the ESP32 was giving me value of current of:

> __Example of fluxogram:__

> START --> Turns on the LED with a delay of 1 second --> Turns off the LED with a delay of 1 second --> RESTART

- Current used by ESP32 while the LED was __ON__: 50mA
- Current used by ESP32 while the LED was __OFF__: 11.5mA


Let's do an average since the time during both is the same 1 second.

__Deep Sleep Mode Average Current__

$I=\frac{50mA + 0.01mA}{2}= 25.0005mA$

This would be an average current of 25.0005 mA.

__Active Mode Average Current__

$I=\frac{50mA + 11.5mA}{2}=30.75mA$

Comparing _Active Mode_ with the _Deep Sleep Mode_ we conclude that the _Deep Sleep Mode_ is definitly more energy eficient. In this case it may not seem a lot of difference but in a long term it can make the difference of days in battery life. Also this is an average of Half-Time in _Active Mode_ and the other Half in _Deep Sleep_ the difference will get even bigger depending on the time that the device stays in _ULP Mode_.

__WARNING:__ This is just an Average and this values should not be used as reference. 

> This will depend on the development board aswell, since there's some models that feature more power consumption.

> This values were taken with and Wemos LoLin without the embeed LED's.

### 5. Types of Operations
This Topic is about types of operations with this _Deep Sleep Mode_. 

The subtopics are ordered by the most eficient modes to least eficient modes.

##### Sleepwalk Mode

This mode uses only the Co-Processor to do everything. 

__Obs:__ It is only capable of doing basic tasks (mencioned in __Chapter 2__).

It consists in running all the code in the _ULP Co-Processor_ and storing all variable data in the _RTC Memory_. Basically the main processor never wakes up. 

__Example:__ Blinking an LED periodically.


##### Sleppy Mode

This mode uses both the Co-Processor and the main processor periodically.

It consists in running basic tasks in the _Co-Processor_ and the more complex ones to the main processor.
Basically it alternates between _Deep Sleep_ and Active Mode.

__Example:__ Fetching an REST API data that contains a temperature info from the web using a __GET__ request. Saving the data in a variable and importing it to the _RTC Memory_, so it turns on an LED or sends an I2C packet to an actuator.

### 6. How to Program it?

Programming the _Co-Processor_ is not a proper easy task. It requires non official librarys and a lack of programming documentation.

##### Libraries needed

The first step is proceed with the instalation of'duff2013' ulptool that is avaliable in his github repository for free.
In this readme file there's every step to install the libraries into your system.
Check his github repository to proceed with the instalation.

__WARNING:__ This is not a common library has the others since it has some different characteristics.
__Check his documentation for more__

https://github.com/duff2013/ulptool

##### Files

In the examples of 'duff2013' you can see that are 3 files instead of a single __.ino__ file.

- The __.ino__ file is the file that we are going to use to write the code for the main processor of the microcontroller, and also the file we are going to upload.
This file carrys not only his own code but also the _ULP Co-Processor_ code that will be in the __.s__ file.

- The __.h__ alias _header_ file contains shared variables between the codes for each processor.

- The __.s__ file is the file that as it's previous mencioned carries the code for the _Co-Processor_. The programming language used is Assembly.

###### Observations

The Assembly file accepts just a certain types of instructions that are following:

![Accepted Commands](mdstructure/commands.png)

### 7. Examples of Programs

Here I will print some documentation given by 'duff2013' where theres commented code explaining line by line.

##### Code Sample

__main.ino__

```cpp
#include "esp32/ulp.h"
// include ulp header you will create
#include "ulp_main.h"
// include ulptool binary load function
#include "ulptool.h"

// Unlike the esp-idf always use these binary blob names
extern const uint8_t ulp_main_bin_start[] asm("_binary_ulp_main_bin_start");
extern const uint8_t ulp_main_bin_end[]   asm("_binary_ulp_main_bin_end");

static void init_run_ulp(uint32_t usec);

void setup() {
    Serial.begin(115200);
        delay(1000);
	    init_run_ulp(100 * 1000); // 100 msec
	    }

void loop() {
    // ulp variables data is the lower 16 bits
    Serial.printf("ulp count: %u\n", ulp_count & 0xFFFF);
    delay(100);
}

//hash: 5c389934265d8016df226704091cd30a
static void init_run_ulp(uint32_t usec) {
    // initialize ulp variable
    ulp_set_wakeup_period(0, usec);
    esp_err_t err = ulptool_load_binary(0, ulp_main_bin_start, (ulp_main_bin_end - ulp_main_bin_start) / sizeof(uint32_t));
     
    // ulp coprocessor will run on its own now
    ulp_count = 0;
    err = ulp_run((&ulp_entry - RTC_SLOW_MEM) / sizeof(uint32_t));
    
    if (err) Serial.println("Error Starting ULP Coprocessor");
						    }
```

__header.h__
```cpp
/*
bals here you want visibility
    for your sketch. Add "ulp_" to the beginning
    of the variable name and must be size 'uint32_t'
*/
#include "Arduino.h"

extern uint32_t ulp_entry;
extern uint32_t ulp_count;
    Put your ULP globals here you want visibility
    for your sketch. Add "ulp_" to the beginning
    of the variable name and must be size 'uint32_t'
*/
```
__ulp.s__
```assembly
/* Define variables, which go into .bss section (zero-initialized data) */
    .data
/* Store count value */
    .global count
count:
    .long 0
/* Code goes into .text section */
    .text
    .global entry
entry:
    move    r3, count
    ld      r0, r3, 0
    add     r0, r0, 1
    st      r0, r3, 0
    halt
```
