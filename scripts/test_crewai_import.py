print('test script start')
try:
    from crewai import Agent, Crew, LLM, Task
    print('import symbols succeeded')
except Exception as e:
    print('import symbols failed', type(e), e)
print('test script end')