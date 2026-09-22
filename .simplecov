SimpleCov.start

if ENV['CI'] == 'true'
  require 'codecov'
  # The codecov gem raises when the unauthenticated uploader is rate-limited,
  # which would fail the job even after tests pass. Keep HTML output and
  # treat upload errors as a warning.
  codecov_formatter = Class.new(SimpleCov::Formatter::Codecov) do
    def format(result)
      super
    rescue StandardError => e
      warn "Codecov upload skipped: #{e.message}"
    end
  end
  SimpleCov.formatter = SimpleCov::Formatter::MultiFormatter.new(
    [
      SimpleCov::Formatter::HTMLFormatter,
      codecov_formatter
    ]
  )
else
  SimpleCov.formatter = SimpleCov::Formatter::HTMLFormatter
end

SimpleCov.start 'rails' do
  add_group 'Units', 'app/models'
  add_group 'Functionals', 'app/controllers'
  add_group 'Services', 'app/services'
  add_group 'Libraries', 'lib/'

  add_filter '/test/'
  add_filter '/config/'
  add_filter '/db/'
  add_filter '/vendor/'
  add_filter '/log/'
  add_filter '/tmp/'
end
